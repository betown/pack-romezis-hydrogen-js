import {COLOR_OPTION_NAME} from '~/lib/constants';

export const formatGroupingWithOptions = ({grouping, getProductByHandle}) => {
  if (
    (!grouping?.products?.length && !grouping?.subgroups?.length) ||
    !getProductByHandle
  )
    return null;

  let validParentGroupProductHandles = [];
  if (grouping.products.length > 0) {
    validParentGroupProductHandles = grouping.products.reduce(
      (acc, {handle}) => {
        if (!getProductByHandle(handle)) return acc;
        return [...acc, {handle}];
      },
      [],
    );
  }
  const hasParentGroupWithProducts = validParentGroupProductHandles.length > 0;

  let validSubgroupProductHandlesByIndex = {};
  if (grouping.subgroups?.length > 0) {
    validSubgroupProductHandlesByIndex = grouping.subgroups.reduce(
      (sgAcc, subgroup, sgIndex) => {
        if (!subgroup.products?.length) return sgAcc;
        const validHandles = subgroup.products.reduce((acc, {handle}) => {
          if (!getProductByHandle(handle)) return acc;
          return [...acc, {handle}];
        }, []);
        return {...sgAcc, [sgIndex]: validHandles};
      },
      {},
    );
  }
  const hasSubgroupsWithProducts = Object.values(
    validSubgroupProductHandlesByIndex,
  ).some((handles) => handles.length > 0);

  let subGroupProductsByIndex = {};
  if (hasSubgroupsWithProducts) {
    subGroupProductsByIndex = Object.entries(
      validSubgroupProductHandlesByIndex,
    ).reduce((acc, [sgIndex, handles]) => {
      return {
        ...acc,
        [sgIndex]: handles.map(({handle}) => getProductByHandle(handle)),
      };
    }, {});
  }

  const parentGroupProducts = validParentGroupProductHandles.map(({handle}) => {
    return getProductByHandle(handle);
  });

  let parentGroupOptionsMap = {};
  if (hasParentGroupWithProducts) {
    parentGroupOptionsMap = parentGroupProducts.reduce((acc, {options}) => {
      options?.forEach(({name, values}) => {
        if (!acc[name]) {
          acc[name] = values;
        } else {
          acc[name] = [...new Set([...acc[name], ...values])];
        }
      });
      return acc;
    }, {});
  }

  let subGroupOptionsMapsByIndex = {};
  if (hasSubgroupsWithProducts) {
    subGroupOptionsMapsByIndex = Object.entries(subGroupProductsByIndex).reduce(
      (acc, [sgIndex, sgProducts]) => {
        const subGroupOptions = sgProducts.reduce((sgAcc, {options}) => {
          options?.forEach(({name, values}) => {
            if (!sgAcc[name]) {
              sgAcc[name] = values;
            } else {
              sgAcc[name] = [...new Set([...sgAcc[name], ...values])];
            }
          });
          return sgAcc;
        }, {});

        return {
          ...acc,
          [sgIndex]: subGroupOptions,
        };
      },
      {},
    );
  }

  const combinedGroupOptionsInitialMap = {};
  if (hasParentGroupWithProducts) {
    Object.entries(parentGroupOptionsMap).forEach(([name, values]) => {
      combinedGroupOptionsInitialMap[name] = {
        values,
      };
      if (name === COLOR_OPTION_NAME && hasSubgroupsWithProducts) {
        combinedGroupOptionsInitialMap[name].groups = [
          {
            name: 'Primary',
            values,
          },
        ];
      }
    });
  }
  if (hasSubgroupsWithProducts) {
    Object.entries(subGroupOptionsMapsByIndex).forEach(
      ([subgroupIndex, subGroupOptions]) => {
        Object.entries(subGroupOptions).forEach(([name, values]) => {
          if (!combinedGroupOptionsInitialMap[name]) {
            combinedGroupOptionsInitialMap[name] = {
              values,
            };
          } else {
            combinedGroupOptionsInitialMap[name].values = [
              ...new Set([
                ...combinedGroupOptionsInitialMap[name].values,
                ...values,
              ]),
            ];
          }
          if (name === COLOR_OPTION_NAME) {
            combinedGroupOptionsInitialMap[name].groups = [
              ...(combinedGroupOptionsInitialMap[name].groups || []),
              {
                name: grouping.subgroups[Number(subgroupIndex)].title,
                values,
              },
            ];
          }
        });
      },
    );
  }

  const combinedGroupOptions = Object.entries(
    combinedGroupOptionsInitialMap,
  ).map(([name, {values, groups}]) => {
    return {
      name,
      values,
      ...(groups && {groups, hasSubgroups: true}),
    };
  });

  const combinedGroupOptionsMap = combinedGroupOptions.reduce(
    (acc, {name, values}) => {
      acc[name] = values;
      return acc;
    },
    {},
  );

  const updatedSubgroups = hasSubgroupsWithProducts
    ? grouping.subgroups.map((subgroup, index) => {
        return {
          ...subgroup,
          products: validSubgroupProductHandlesByIndex[index] || [],
        };
      })
    : [];

  return {
    ...grouping,
    options: combinedGroupOptions,
    optionsMap: combinedGroupOptionsMap,
    allProducts: [
      ...validParentGroupProductHandles,
      ...updatedSubgroups.flatMap(({products}) => products),
    ],
    products: validParentGroupProductHandles,
    subgroups: updatedSubgroups,
  };
};

import {useProductBuilderContext} from './ProductBuilderContext';

export function ProductBuilderPagination() {
  const {productBuilderData, productBuilderSettings} =
    useProductBuilderContext();
  const paginationType = productBuilderSettings.section?.pagination || 'bar';
  const currentPage =
    productBuilderData.page == 'summary'
      ? productBuilderSettings.bundlePieces?.length + 1
      : productBuilderData.page;
  const totalPages = productBuilderSettings.bundlePieces?.length + 1; //accounts for the summary;
  const stepSettings = productBuilderSettings?.bundlePieces?.[currentPage];
  const highlightColor =
    stepSettings?.highlightColor ||
    productBuilderSettings?.section?.highlightColor;

  const completedSteps = (currentPage * 100) / totalPages;
  const buildPaginationDots = () => {
    const paginationDots = [];

    for (let i = 1; i <= totalPages; i++) {
      paginationDots.push(
        <li
          key={`pagination-${i}`}
          className="product-builder__pagination-dot transition-color h-2 w-2 rounded-full bg-gray duration-150 ease-in-out"
          style={{
            backgroundColor:
              currentPage === i ? highlightColor || '#008464' : '',
          }}
        ></li>,
      );
    }

    return paginationDots;
  };

  if (!productBuilderSettings?.bundlePieces?.length) return null;

  return (
    <div
      className={`product-builder__pagination pointer-events-none z-10 block w-full ${
        paginationType === 'bar'
          ? 'absolute right-0 top-0'
          : 'order-2 text-center lg:absolute lg:bottom-5'
      }`}
    >
      {paginationType === 'bar' && (
        <div
          className="product-builder__pagination-bar-progress relative block h-1 rounded-r-full transition-all duration-300 ease-in-out"
          style={{
            width: `${completedSteps}%`,
            backgroundColor: highlightColor || '#008464',
          }}
        ></div>
      )}

      {paginationType === 'dots' && (
        <ul className="product-builder__pagination-dots bg-black/50 pointer-events-none mx-auto inline-flex gap-5 rounded-full px-5 py-1">
          {buildPaginationDots()}
        </ul>
      )}
    </div>
  );
}

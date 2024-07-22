import {containerSettings} from '~/settings/container';

export const Schema = () => {
  return {
    category: 'Custom Products',
    label: 'Product Builder',
    name: 'productBuilder',
    key: 'product-builder',
    fields: [
      containerSettings(),
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description:
          'Configure a product to be shipped as a single unit for a customer allowing multiple SKUs to be combined into a single item',
        fields: [
          {
            component: 'markdown',
            name: 'header',
            label: 'Header',
          },
          {
            component: 'markdown',
            name: 'description',
            label: 'Description',
          },
          {
            component: 'color',
            name: 'highlightColor',
            label: 'Highlight Color',
          },
          {
            component: 'select',
            name: 'pagination',
            label: 'Pagination Style',
            options: [
              {
                label: 'Bar',
                value: 'bar',
              },
              {
                label: 'Dots',
                value: 'dots',
              },
            ],
          },
          {
            component: 'toggle',
            name: 'lightText',
            label: 'Light Text?',
            description: 'Changes the text color of the section',
            toggleLabels: {
              true: 'Light',
              false: 'Dark',
            },
          },
          {
            component: 'toggle',
            name: 'showSelectedOption',
            label: 'Show Selected Option?',
            toggleLabels: {
              true: 'Yes',
              false: 'No',
            },
            description: 'Adds the selected option next to the option title',
          },
          {
            component: 'group-list',
            name: 'optionStyle',
            label: 'Option Style',
            itemProps: {
              label: `Option: {{item.optionName}}`,
            },
            fields: [
              {
                component: 'text',
                name: 'optionName',
                label: 'Option Name',
                description:
                  "Name of the option on the product (e.g. 'Color'), it must match the product option name, or it will not take effect",
                validate: {
                  required: true,
                },
              },
              {
                component: 'select',
                name: 'selectorStyle',
                label: 'Selector Style',
                options: [
                  {
                    label: 'Swatches',
                    value: 'swatches',
                  },
                  {
                    label: 'Buttons',
                    value: 'buttons',
                  },
                ],
                description:
                  'Swatches are best suitable for options with simple graphical representation, while buttons are best for text-based options',
              },
            ],
          },
        ],
      },
      {
        component: 'group-list',
        name: 'bundlePiece',
        label: 'Bundle Piece',
        fields: [
          {
            component: 'text',
            name: 'pieceName',
            label: 'Part Name',
            description:
              'Name of this part of the product that will be shown next to the option(s) selected, e.g. "Base" (this value) - "Color: Red" (option selected)',
          },
          {
            component: 'markdown',
            name: 'header',
            label: 'Header',
            defaultValue: 'Bundle Piece',
            description:
              'Use keyword {productName} to display the product name anywhere on the text above to display the current step product name',
          },
          {
            component: 'markdown',
            name: 'description',
            label: 'Description (optional)',
            description:
              'Use keyword {productName} to display the product name anywhere on the text above to display the current step product name',
          },
          {
            component: 'color',
            name: 'highlightColor',
            label: 'Highlight Color',
            description:
              "Used to change the color of any piece wrapped with the Bold selector within this step's title or description",
          },
          {
            component: 'productSearch',
            name: 'product',
            label: 'Product',
          },
          {
            component: 'toggle',
            name: 'showPrice',
            label: 'Show Price?',
            toggleLabels: {
              true: 'Yes',
              false: 'No',
            },
            description:
              "Adds the current product price next to the step's title",
          },
        ],
      },
      {
        component: 'group',
        name: 'summary',
        label: 'Summary Settings',
        fields: [
          {
            component: 'textarea',
            name: 'header',
            label: 'Header',
            defaultValue: 'Summary',
          },
          {
            component: 'markdown',
            name: 'description',
            label: 'Description',
          },
          {
            component: 'toggle',
            name: 'showPrice',
            label: 'Show Price?',
            toggleLabels: {
              true: 'Yes',
              false: 'No',
            },
            description:
              'Shows price of each product selection next to each indicator',
          },
          {
            component: 'text',
            name: 'AtcLabel',
            label: 'Add to Cart Label',
            defaultValue: 'Add to Cart',
            description: 'If empty defaults to Add to Cart',
          },
        ],
      },
      // Scrapped down due to lack of time
      // {
      //   component: 'group',
      //   name: 'accessories settings',
      //   label: 'Accessories Settings',
      //   fields: [
      //     {
      //       component: 'markdown',
      //       name: 'header',
      //       label: 'Section Header',
      //       description: 'Heading for the accessories section',
      //     },
      //     {
      //       component: 'markdown',
      //       name: 'description',
      //       label: 'Section Description',
      //     },
      //     {
      //       component: 'groupList',
      //       name: 'accessories',
      //       label: 'Accessories',
      //       fields: [
      //         {
      //           component: 'productSearch',
      //           name: 'product',
      //           label: 'Product',
      //         },
      //       ],
      //     },
      //   ],
      // },
    ],
  };
};

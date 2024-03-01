/*
 * BACKPACK API QUERIES -------------------------------------------------------
 */

export const SITE_SETTINGS_QUERY = `#graphql
  query SiteSettings($version: Version) {
    siteSettings(version: $version) {
      id
      status
      settings
      publishedAt
      createdAt
      updatedAt
      favicon
      seo {
        title
        description
        keywords
      }
    }
  }
`;

export const PRODUCT_GROUPINGS_QUERY = `#graphql
  query ProductGroupings($first: Int!, $after: String) {
    groups(first: $first, after: $after) {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          id
          title
          description
          products {
            handle
          }
          subgroups {
            id
            title
            description
            products {
              handle
            }
          }
        }
      }
    }
  }
`;

export const SECTION_FRAGMENT = `#graphql
  fragment section on Section {
    id
    title
    status
    data
    publishedAt
    createdAt
    updatedAt
    parentContentType
  }
`;

import { useLoaderData } from '@remix-run/react';
import { Card, Layout, Page } from '@shopify/polaris';
import { authenticate } from 'app/shopify.server';
import React from 'react'
export async function loader({ request }: { request: Request }) {
    const { admin } = await authenticate.admin(request);

    // First GraphQL query to fetch inventory items
    const idResponse = await admin.graphql(
      `#graphql
      query inventoryItems {
        inventoryItems(first: 2) {
          edges {
            node {
              id
              tracked
              sku
            }
          }
        }
      }`,
    );

    const idData = await idResponse.json();

    // Extract all IDs from the first query
    const inventoryItemIds = idData?.data?.inventoryItems?.edges.map((edge: any) => edge.node.id);

    if (!inventoryItemIds || inventoryItemIds.length === 0) {
        throw new Error("No inventory items found.");
    }

    // Fetch data for each ID using the second GraphQL query
    const inventoryDetails = await Promise.all(
        inventoryItemIds.map(async (id: string) => {
            const inventoryLevelResponse = await admin.graphql(
              `#graphql
              query inventoryItemToProductVariant {
                inventoryItem(id: "${id}") {
                  id
                  inventoryLevels(first: 1) {
                    edges {
                      node {
                        id
                        location {
                          id
                          name
                        }
                        quantities(names: ["available", "committed", "incoming", "on_hand", "reserved"]) {
                          name
                          quantity
                        }
                      }
                    }
                  }
                  variant {
                    id
                    title
                    product {
                      id
                      title
                    }
                  }
                }
              }`,
            );
            return inventoryLevelResponse.json();
        })
    );

    // Combine the original inventory data with the details
    return { idData, inventoryDetails };
}


 const Inventory = () => {
    const inventoryData = useLoaderData(); // Accessing the loader data

    return (
            <Page fullWidth>
              <Layout>
                <Layout.Section>
                  {inventoryData?.data?.inventoryItems?.edges?.map((product) => {
                    return (
                      <Card key={product?.node?.id}>
                        <p>{product?.node?.id}</p>
                      </Card>
                    )
                  })}
        
                </Layout.Section>
              </Layout>
            </Page>
    );
};

export default Inventory
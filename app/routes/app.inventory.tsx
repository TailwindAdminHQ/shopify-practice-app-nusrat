import { useLoaderData } from '@remix-run/react';
import { Card, Layout, Page } from '@shopify/polaris';
import { authenticate } from 'app/shopify.server';
import React from 'react'
export async function loader({ request }: { request: Request }) {
    const { admin } = await authenticate.admin(request);

    const response = await admin.graphql(
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
    
    const data = await response.json();

    console.log('=====================================================================================================================================================================', data.data.inventoryItems.edges)
    
    return data;
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
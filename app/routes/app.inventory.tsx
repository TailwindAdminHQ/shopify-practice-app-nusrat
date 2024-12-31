import { useLoaderData } from '@remix-run/react';
import { Layout, Page } from '@shopify/polaris';
import { authenticate } from 'app/shopify.server';
import React from 'react'
//47090763366577   47095287382193
// gid://shopify/InventoryLevel/108840026289?inventory_item_id=47090763366577
type LoaderData = {
  available: {
      name: string;
      quantity: number;
  };
};

export async function loader({ request }: { request: Request }) {
    const { admin } = await authenticate.admin(request);

    const response = await admin.graphql(
      `#graphql
      query {
        inventoryLevel(id: "gid://shopify/InventoryLevel/108840026289?inventory_item_id=47090763366577") {
          id
          quantities(names: ["available", "incoming", "committed", "damaged", "on_hand", "quality_control", "reserved", "safety_stock"]) {
            name
            quantity
          }
          item {
            id
            sku
          }
          location {
            id
            name
          }
        }
      }`,
    );
    
    const data = await response.json();

    const available = data?.data?.inventoryLevel?.quantities?.find(
      (quantity: { name: string; quantity: number }) => quantity.name === "available"
    );
    
    console.log('Available Object:', available.quantity);
    return {data, available};
}

 const Inventory = () => {
    const {available} = useLoaderData<LoaderData>(); // Accessing the loader data

    return (
            <Page fullWidth>
              <Layout>
                <Layout.Section>
                  <h2>{available.quantity}</h2>
                </Layout.Section>
              </Layout>
            </Page>
    );
};

export default Inventory
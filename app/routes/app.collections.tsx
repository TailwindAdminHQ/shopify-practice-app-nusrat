import { Box, Card, Layout, Page, Text } from '@shopify/polaris'
import React from 'react'
import { useLoaderData } from "@remix-run/react";
import { authenticate } from 'app/shopify.server';

export async function loader({request}) {
    // console.log('request=====================================================================================================================================================================================================================', request)
    const { admin } = await authenticate.admin(request);

    const response = await admin.graphql(
      `#graphql
      query {
        collections(first: 5) {
          edges {
            node {
              id
              title
              handle
              updatedAt
              sortOrder
            }
          }
        }
      }`,
    );
    
    const data = await response.json();
    return data;
}
const Collections = () => {
    const getCollections = useLoaderData();
    console.log('=====================================================================================================================================', getCollections.data.collections.edges)
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
            {getCollections.data.collections.edges?.map((collection)=>{
                return (
<Card key={collection?.node?.id}>
          <p>{collection?.node?.title}</p>
          </Card>
                )
            })}
          
        </Layout.Section>
      </Layout>
    </Page>
  )
}

export default Collections
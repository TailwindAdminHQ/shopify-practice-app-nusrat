import { Card, Layout, Page } from '@shopify/polaris'
import React from 'react'
import { useLoaderData } from "@remix-run/react";
import { authenticate } from 'app/shopify.server';
type Collection = {
  id: string;
  title: string;
  handle: string;
  updatedAt: string;
  sortOrder: string;
};

type LoaderData = {
  data: {
    collections: {
      edges: { node: Collection }[];
    };
  };
};

export async function loader({ request }: { request: Request }) {
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
  const getCollections = useLoaderData<LoaderData>();
  // console.log('=====================================================================================================================================', getCollections.data.collections.edges)
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          {getCollections.data.collections.edges?.map((collection) => {
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
import { Card, Layout, Page } from '@shopify/polaris'
import React from 'react'
import { useLoaderData } from "@remix-run/react";
import { authenticate } from 'app/shopify.server';
type Product = {
    id: string;
    title: string;
    handle: string;
    resourcePublicationOnCurrentPublication: {
      publication: {
        name: string;
        id: string;
      };
      publishDate: string;
      isPublished: boolean;
    };
  };
  
  type LoaderData = {
    data: {
      products: {
        edges: { node: Product }[];
      };
    };
  };
  
export async function loader({ request }: { request: Request }) {
  // console.log('request=====================================================================================================================================================================================================================', request)
  const { admin } = await authenticate.admin(request);

const response = await admin.graphql(
  `#graphql
  query {
    products(first: 10, reverse: true) {
      edges {
        node {
          id
          title
          handle
          resourcePublicationOnCurrentPublication {
            publication {
              name
              id
            }
            publishDate
            isPublished
          }
        }
      }
    }
  }`,
);

const data = await response.json();
  return data;
}
const Products = () => {
    const getProducts = useLoaderData<LoaderData>();
    //   console.log('=====================================================================================================================================', getProducts.data.products.edges)
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          {getProducts.data.products.edges?.map((product) => {
            return (
              <Card key={product?.node?.id}>
                <p>{product?.node?.title}</p>
              </Card>
            )
          })}

        </Layout.Section>
      </Layout>
    </Page>
  )
}

export default Products
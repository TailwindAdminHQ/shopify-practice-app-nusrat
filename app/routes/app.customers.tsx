import { type ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useSubmit } from '@remix-run/react';
import { Button, Card, Page, TextField } from '@shopify/polaris';
import { createCustomer } from 'app/api/prisma.server';
import { authenticate } from 'app/shopify.server';
import React, { useState } from 'react'
export async function action({
    request,
}: ActionFunctionArgs) {
    const { admin } = await authenticate.admin(request);
     const formData = await request.formData();
     const dynamicName = formData.get("name") as string;
     const dynamicEmail = formData.get("email") as string;

    const response = await admin.graphql(
        `#graphql
   mutation customerCreate($input: CustomerInput!) {
     customerCreate(input: $input) {
       userErrors {
         field
         message
       }
       customer {
         id
         email
         phone
         taxExempt
         emailMarketingConsent {
           marketingState
           marketingOptInLevel
           consentUpdatedAt
         }
         firstName
         lastName
         amountSpent {
           amount
           currencyCode
         }
         smsMarketingConsent {
           marketingState
           marketingOptInLevel
         }
         addresses {
           address1
           city
           country
           phone
           zip
         }
       }
     }
   }`,
        {
            variables: {
                "input": {
                    "email": dynamicEmail,
                    "phone": "+16465555555",
                    "firstName": dynamicName,
                    "lastName": "Lastname",
                    "emailMarketingConsent": {
                        "marketingOptInLevel": "CONFIRMED_OPT_IN",
                        "marketingState": "SUBSCRIBED"
                    },
                    "addresses": [
                        {
                            "address1": "412 fake st",
                            "city": "Ottawa",
                            "province": "ON",
                            "phone": "+16469999999",
                            "zip": "A1A 4A1",
                            "lastName": "Lastname",
                            "firstName": "Steve",
                            "countryCode": "CA"
                        }
                    ]
                }
            },
        },
    );


    const data = await response.json();
    
    await createCustomer({
        name:dynamicName,
        email:dynamicEmail,
    })
    return data;
}

const Customers = () => {
    const submit = useSubmit();
    const actionData = useActionData();
    console.log(actionData)
    const generateCustomer = () => submit({}, { replace: true, method: "POST" })
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    return (
        <Page>
            <Card>
                <Form onSubmit={generateCustomer} method='post'>
                    <TextField
                        value={name}
                        onChange={(value) => setName(value)}
                        label="Name"
                        name="name"
                        id="name"
                        autoComplete="off"
                    />
                    <TextField
                        value={email}
                        onChange={(value) => setEmail(value)}
                        label="Email"
                        name="email"
                        id="email"
                        autoComplete="off"
                    />
                    <Button>Create a customer</Button>
                </Form>

            </Card>
        </Page>
    )
}

export default Customers

type CreateCustomerInput = {
    email: string;
    name: string;
};

export const createCustomer = async ({ email, name }: CreateCustomerInput) => {
    return await prisma.customer.create({
        data: {
            email: email,
            name: name,
        },
    });
};

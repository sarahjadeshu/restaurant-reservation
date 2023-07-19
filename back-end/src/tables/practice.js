// Controller File

function read(req, res) {
    const { customer } = res.locals;
    res.json({ data: customer })
}

async function create(req, res) {
    const { name, address, date_joined, contact_name, contact_number } = req.body.data;

    const newCustomer = {
        name: name,
        address: address,
        date_joined: date_joined,
        contact_name: contact_name,
        contact_number: contact_number,
    }

    const response = await service.create(newCustomer);
    res.status(201).json({ data: response })
}


// Service File

function read(customer_id) {
    return knex("customer")
    .where({ id: customer_id })
    .first();
}

function create(newCustomer) {
    return knex("customer")
    .insert(newCustomer, "*")
    .then((createdCustomer) => createdCustomer[0])
}


// Router File

router.route("/").post(controller.create).all(methodNotAllowed);
router.route("/:customerId").get(controller.read).all(methodNotAllowed);
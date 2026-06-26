const validateProductData = (req, res, next) => {
    const { sku, name, brand, price, stock } = req.body;

    if (req.method === 'POST') {
        if (!sku || !name || !brand) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos obligatorios: sku, name y brand son requeridos.'
            });
        }
    }

    // 2. Validar que el precio sea un número válido y positivo
    if (price !== undefined && (isNaN(price) || price < 0)) {
        return res.status(400).json({
            success: false,
            message: 'El precio debe ser un número igual o mayor a 0.'
        });
    }

    // 3. Validar que el stock sea un número entero válido y no negativo
    if (stock !== undefined && (!Number.isInteger(Number(stock)) || stock < 0)) {
        return res.status(400).json({
            success: false,
            message: 'El stock debe ser un número entero igual o mayor a 0.'
        });
    }

    // Si todo está perfecto, formateamos el SKU a mayúsculas para estandarizar
    if (sku !== undefined) {
    req.body.sku = sku.toUpperCase().trim();
}

    // ¡Todo orden, que pase al controlador!
    next();
};

module.exports = {
    validateProductData
};
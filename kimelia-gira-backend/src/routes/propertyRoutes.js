/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a new property (AI Auto-translates Title & Description)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: 
 *                 type: string
 *                 example: "Beautiful 3 bedroom house in Kigali"
 *               description: 
 *                 type: string
 *                 example: "This house is located near the city center with a great view."
 *               price: { type: number }
 *               type: { type: string, enum: [sale, rent] }
 *               propertyType: { type: string, enum: [house, apartment, land] }
 *               location: 
 *                 type: string
 *                 description: "JSON string of location object"
 *               images: { type: array, items: { type: string, format: binary } }
 */
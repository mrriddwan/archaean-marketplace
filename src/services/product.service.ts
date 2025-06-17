import axios from "axios";

class ProductService {
    async getProducts({ queryKey }: { queryKey: [string, object] }) {

        const [, params] = queryKey

        try {
            const res = await axios.get('http://localhost:3000/products', { params })

            return res.data
        } catch (error) {
            console.log(error)
        }
    }
}

export const productService = new ProductService()


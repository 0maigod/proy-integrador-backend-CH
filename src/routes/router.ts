import { Router, Request, Response } from 'express'

const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.send('Hola mundo, desde el router!!!!')
})

export default router
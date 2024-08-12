import {Router} from 'express'
export const router = Router();
   res.semd("List all pelicula")
router.get("/", (req, res) => res.send("List all pelicula"))
router.get("/:id", (req, res) => res.send("List a pelicula by id"))
router.get("/", (req, res) => res.send("Create movie"))
router.get("/", (req, res) => res.send("Uptade an existing pelicula"))
router.get("/", (req, res) => res.send("Delete a pelicula"))
import express from 'express';
import upload from "../middleware/upload.js";

import { login, register, logout } from '../controllers/usercontroller.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { refreshToken } from '../controllers/RefreshToken.js';

import { getSpareparts, createSparepart, updateSparepart, deleteSparepart} from "../controllers/sparepartcontroller.js";

import { getFormPembelian, getFormPembelianById, createFormPembelian, updateFormPembelian, deleteFormPembelian} from "../controllers/pembeliancontroller.js";

const router = express.Router();

// SPAREPART
router.get("/spareparts", verifyToken, getSpareparts);
router.post("/spareparts", verifyToken, upload.single("image"), createSparepart);
router.put("/spareparts/:id", verifyToken, upload.single("image"), updateSparepart);
router.delete("/spareparts/:id", verifyToken, deleteSparepart);

// PEMBELIAN
router.get("/pembelian/:id_user", verifyToken, getFormPembelian);
router.get("/pembelian/detail/:id", verifyToken, getFormPembelianById);
router.post("/pembelian", verifyToken, createFormPembelian);
router.put("/pembelian/:id", verifyToken, updateFormPembelian);
router.delete("/pembelian/:id", verifyToken, deleteFormPembelian);

// USER AUTH
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/token", refreshToken);

export default router;

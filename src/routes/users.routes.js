import { Router } from 'express';

// Middlewares
import { validateId } from '../middlewares/users/validate-id.js';
import { validateUserBody } from '../middlewares/users/validate-user-body.js';
import { normalizeUserBody } from '../middlewares/users/normalize-user-body.js';
import { validatePatchUser } from '../middlewares/users/validate-patch-user.js';
import { ensureUniqueEmail } from '../middlewares/users/ensure-unique-email.js';

// Controllers
import { getUsers, getUserById, createUser } from '../controllers/users.controller.js'

const router = Router();

router.get('/', getUsers);
router.get('/:id', validateId, getUserById);
router.post('/', validateUserBody, normalizeUserBody, ensureUniqueEmail, createUser);

export default router;
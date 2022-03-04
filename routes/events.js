const { Router } = require("express");
const { check } = require('express-validator');
const { getEvents, createEvents, updateEvents, deleteEvents } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validateFields } = require('../middlewares/validate-fields');
const { isDate } = require('../helpers/isDate');
const router = Router();

//Todas deben passar por validacion de JWT
router.use( validarJWT );

//Obtener eventos
router.get( 
    '/', 
    getEvents
);

router.post( 
    '/',
    [
        check( 'title', 'El titulo es obligatorio').not().isEmpty(),
        check( 'start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check( 'end', 'La fecha de finalizacion es obligatoria').custom( isDate ),
        validateFields
    ], 
    createEvents

); 

router.put( 
    '/:id', 
    updateEvents

); 

router.delete( 
    '/:id', 
    deleteEvents

);

module.exports = router;


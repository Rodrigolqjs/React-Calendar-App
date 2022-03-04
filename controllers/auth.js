const {response} = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User-model')
const {generarJWT} = require('../helpers/jwt')

const createUser = async( req, res = response ) => {

    const {name, email, password} = req.body;

    try {
        let user = await User.findOne({ email })
        console.log(user);
        if ( user ) {
            return res.status( 400 ).json({
                ok:false,
                msg: 'un user ya existe con este correo'
            })
        }
        user = new User( req.body )
    
        //Encriptar contrasenia
        const salt = bcrypt.genSaltSync()
        user.password = bcrypt.hashSync( password, salt )

        await user.save();

        const token = await generarJWT( user.id, user.name );
    
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: 'por favor, hable con el administrador',
        })
    }
}

const loginUser = async( req, res = response ) => {

    const {email, password} = req.body
    try {

        const user = await User.findOne({ email });
            
        if ( !user ) {
            return res.status( 400 ).json({
                ok:false,
                msg: 'El usuario no existe con ese email'
            });
        };

        //Confirmar los password
        const validPassword = bcrypt.compareSync( password, user.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })
        }

        //Generar JsonWebToken

        const token = await generarJWT( user.id, user.name );

        res.json({
            ok:true,
            uid:user.id,
            name:user.name,
            token
        })

        
    } catch (error) {
        console.log(error);        
        res.json({
            ok: true,
            msg: 'login',
            email,
            password
    
        })
    }
}

const revalidateToken = async( req, res = response ) => {

    const { uid, name } = req;

    // generar un nuevo JWT y retornar en esta peticion

    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        msg: 'renew',
        token: token
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}
const { response } = require("express");
const Event = require('../models/Events-model')

//getEvents
const getEvents = async( req, res = response ) => {

    const events = await Event.find()
                              .populate('user', 'name')

    res.json({
        ok: true,
        msg: 'getEvents',
        events
    })

};
const createEvents = async( req, res = response) => {

    const event = new Event(req.body)

    try {
        event.user = req.uid
        const savedEvent = await event.save();
        res.json({
            ok:true,
            event: savedEvent
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }

};
const updateEvents = async( req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        
        const event = await Event.findById( eventId );

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'no hay un evento con este id'
            })
        } else if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'no tiene privilegio de editar este evento'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const updatedEvent = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        res.json({
            ok: true,
            event: updatedEvent
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

};
const deleteEvents = async( req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        
        const event = await Event.findById( eventId );

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'no hay un evento con este id'
            })
        } else if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'no tiene privilegio de eliminar este evento'
            });
        }

        const deletedEvent = await Event.findByIdAndDelete( eventId );

        return res.json({
            ok: true,
            event: deletedEvent
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

    return res.json({
        ok: true,
        msg: 'deleteEvents'
    })

};

module.exports = {
    getEvents,
    createEvents,
    updateEvents,
    deleteEvents,
}

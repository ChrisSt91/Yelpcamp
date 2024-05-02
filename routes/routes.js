const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const appError = require('../utils/errorHandling/appError')
const wrapAsync = require('../utils/wrapAsync');
const { campgroundSchema } = require('../schemas')

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new appError(msg, 400)
    } next();
}

//Routes

router.get('/', (req, res) => {
    res.render('campgrounds/home')
})

router.get('/campgrounds', wrapAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))

router.get('/campgrounds/new', (req, res, next) => {
    res.render('campgrounds/new')
})

router.post('/campgrounds', validateCampground, wrapAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`)
}))

router.get('/campgrounds/:id', wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        return next(new appError('Campground Not Found', 404));
    }
    res.render('campgrounds/show', { campground }) 
}))

router.get('/campgrounds/:id/edit', wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground })
}))

router.put('/campgrounds/:id', validateCampground, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/campgrounds/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

module.exports = router;
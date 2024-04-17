const uuid = require("uuid");
const Place = require("../models/place");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Somnthing went wrong, could not find a place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) }); // => { place } => { place: place }
};

// function getPlaceById() { ... }
// const getPlaceById = function() { ... }

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
    console.log(places)
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later",
      500
    );
    return next(error);
  }
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  // const title = req.body.title;
  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    image:
      "https://www.google.com/imgres?q=vilage&imgurl=https%3A%2F%2Fimages-wixmp-ed30a86b8c4ca887773594c2.wixmp.com%2Ff%2F02fd6c69-0abe-440c-8a31-b1fd6dcd2a6e%2Fdfxwloi-7e38bc48-08b9-49e9-b1dd-09d08471b995.png%2Fv1%2Ffill%2Fw_623%2Ch_350%2Cq_70%2Cstrp%2F947_by_xavcovert_dfxwloi-350t.jpg%3Ftoken%3DeyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTA3OCIsInBhdGgiOiJcL2ZcLzAyZmQ2YzY5LTBhYmUtNDQwYy04YTMxLWIxZmQ2ZGNkMmE2ZVwvZGZ4d2xvaS03ZTM4YmM0OC0wOGI5LTQ5ZTktYjFkZC0wOWQwODQ3MWI5OTUucG5nIiwid2lkdGgiOiI8PTE5MjAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.6KAHZVgA_uQdvuciLLXhGHINSm1D3nZmqMgDN_1K_bM&imgrefurl=https%3A%2F%2Fwww.deviantart.com%2Ftag%2Fvilage&docid=LbLffQ9miDt0kM&tbnid=v2Rjnm-hEVSjDM&vet=12ahUKEwjMqLWl5bqFAxWWi_0HHdH2ArAQM3oECBkQAA..i&w=623&h=350&hcb=2&ved=2ahUKEwjMqLWl5bqFAxWWi_0HHdH2ArAQM3oECBkQAA",
    creator,
  });

  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;
let place;
try {

  place= await Place.findById({placeId})
} catch (err) {
  const error= new HttpError(
    'somthing went worng, could not update place'
    ,500)
  return next(error)
}
 
  place.title = title;
  place.description = description;
try {
 await place.save()
} catch (err) {
  const error= new HttpError(
    'somthing went worng, could not update place'
    ,500)
  return next(error)
}
  

  res.status(200).json({ place: place.toObject({getters:true}) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById({placeId}) 
  } catch (err) {
    const error = new HttpError(
      'Could not find and delete the place',
      500
    )
    return next(error)
  }

  try {
    await place.remove()
  } catch (err) {
    const error = new HttpError(
      'Could not find and delete the place',
      500
    )
    return next(error)
  }
  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

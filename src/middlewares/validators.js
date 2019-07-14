import { check, validationResult } from 'express-validator'; 

// SIGNIN
export const signinValidator = [
    check('email', 'Your email is not valid').not().isEmpty().isEmail(),
    check('password', 'Your password is not valid').not().isEmpty()
]

// SIGNUP
export const signupValidator = [
    check('email', 'Your email is not valid').not().isEmpty().isEmail(),
    check('password', 'Your password is not valid, min of 6 characters').not().isEmpty().isLength({ min: 6 }),
    check('first_name', 'Your first name is not valid').not().isEmpty(),
    check('last_name', 'Your last name is not valid').not().isEmpty(),
]

//CREATE TRIP
export const createTripValidator = [
    check('bus_id', 'Your bus_id is not valid').not().isEmpty().isNumeric(),
    check('origin', 'Your origin is not valid').not().isEmpty().isAlpha(),
    check('destination', 'Your destination is not valid').not().isEmpty().isAlpha(),
    check('trip_date', 'Your trip date is not valid').not().isEmpty().isAfter().isISO8601(),
    check('fare', 'Your fare is not valid').not().isEmpty().isNumeric(),
]

export function signinValidatorFn(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array()[0].msg);
    } else {
    next();
    }
}
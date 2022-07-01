const error400 = (res, msg = 'Some Api config error.', err= null) => {
    return res.status(400).send({
        error: true,
        message: msg,
        errors: err
    });
}

const error401 = (res, msg = 'Permission Deny.', err= null) => {
    return res.status(401).send({
        error: true,
        message: msg,
        errors: err
    });
}

const error422 = (res, msg = 'Some Api config error.', err=null) => {
    return res.status(422).send({
        error: true,
        message: msg,
        errors: err
    });
}

const error501 = (res, msg = 'Internal DB Error.', err=null) => {
    return res.status(501).send({
        error: true,
        message: msg,
        errors: err
    });
}

const success = (res, msg = 'All good', data = null) => {
    return res.status(200).json({
        error: false,
        message: msg,
        data: data
    });
}

module.exports = {
    error400,
    error401,
    error422,
    error501,
    success,
}
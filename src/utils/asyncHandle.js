const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).
    catch((err) => next(err))
  }
}



export { asyncHandler }


//const asyncHandler = (fn) => {}
//const asyncHandler = (fn) => () => {}
//const asyncHandler = (fn) => async () => {}
//fn takes another function () as parameter and that function returns some value {}

// const asyncHandler = (fn) => async(req, res, next) => {
//   try{
//     await fn(req, res, next)
//   }catch(error){
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message
//     })
//   }
// } 
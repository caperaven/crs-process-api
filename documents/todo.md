// 1. set pass and fail on root instead of the args.
// 2. look at shortcuts e.g. $data for #process.data.
// 3. add generic log feature that will work on any step
// done5. how to extend domExample shortcuts from the outside e.g. $context.domExample.variables = $var.
{
    "$var": "$context.domExample.variables",
    "$obj": {}
} // hook to process so that you can get access too it.
//7. look at passing in translations object to reference with $text.
//    1. write tests for this and make sure it works

8. add step name to aborting and proper error handling
9. ensure proper error messages on failures.
10. how do I show progress on this.
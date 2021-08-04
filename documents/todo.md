1. set pass and fail on root instead of the args.
2. look at shortcuts e.g. $data for #process.data.
3. add generic log feature that will work on any step
4. look at passing in translations object to reference with $text.
5. how to extend schema shortcuts from the outside e.g. $context.schema.variables = $var.
{
    "$var": "$context.schema.variables",
    "$obj": {}
} // hook to process so that you can get access too it.
6. add step name to aborting and proper error handling
import { CfnOutput, RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import { GraphqlApi, SchemaFile } from 'aws-cdk-lib/aws-appsync';
import { Construct } from 'constructs'
import {Code, Function,Runtime} from 'aws-cdk-lib/aws-lambda'
import * as path from 'path'
// import { PolicyDocument, PolicyStatement } from 'aws-cdk-lib/aws-iam';
// import { Resolver } from 'dns';
// import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
// // import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkGraphqlStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Initializing a GraphQl API
   const Api=new GraphqlApi(this,'PostAPI',{
    name:'AppSyncPostApi',
    schema:SchemaFile.fromAsset(path.resolve(__dirname, 'graphql.gql')),
    xrayEnabled:true
   })

  //  A function for Retrieving a Blog post
   const lambda=new Function(this,'getPost',{
    handler:'getPost.handler',
    runtime:Runtime.NODEJS_16_X,
    code:Code.fromAsset('src/lambdas'),
    functionName:'getPost',
    description:'Retrieving Blog Post by id',
    // initialPolicy:
    
   })

  //  const eventso=new EventSource.bind(lambda2)
  //  lambda.addEventSource()
    // A function for Creating a Blog post
   const lambda2=new Function(this,'CreatePost',{
    handler:'addPost.handler',
    runtime:Runtime.NODEJS_16_X,
    code:Code.fromAsset('src/lambdas'),
    functionName:'CreatePost',
    description:'Creating Blog Post Item'
   })


  //   new  CfnOutput(this, 'GraphqlApi',{
  //   exportName:'GraphqlApi',
  //   value:Api.graphqlUrl
  //  })
   
  //  //Creating A Database
  //  const db=new Table(this,'BlogTable',{
  //   partitionKey:{name:'id',type:AttributeType.NUMBER},
  //   billingMode:BillingMode.PAY_PER_REQUEST,
  //   removalPolicy:RemovalPolicy.DESTROY,
  //   tableName:'BlogTable',
  //  })
  
 

  // Creating Functions Dynamically, Creating LambdaDataSources, Resolving the API Endpoints, 
  // and Granting Table permisions to the Functions
  const resolvers=[
    {typeName:'Query', fieldName:'getPost', access:['dynamodb:GetItem']},
    // {typeName:'Quer', fieldName:'getPos', access:['dynamodb:GetIte']}
  ]
  resolvers.forEach(({access, ...props})=>{
    const id =props.fieldName
    const handler=new Function(this, id,{
      code:Code.fromAsset('lambdas'),
      // environment:{
      //   TABLE_NAME: db.tableName,
      // },
      handler: id+'.handler',
      runtime:Runtime.NODEJS_16_X,
      functionName: id+'Function'

    })
   
   const datasource= Api.addLambdaDataSource(props.fieldName+'Datasource',handler)
   datasource.createResolver(props.fieldName+'Resolver',props)
   datasource.createFunction
  })

  }
}

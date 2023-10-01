## Advertiser BE
### How to deploy
1. Login in AWS
2. Open terminal
3. Run `aws configure` and add the required things from AWS
4. Run the following command to login in AWS ECR `aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 462404724564.dkr.ecr.eu-central-1.amazonaws.com`
5. Run `docker build -t advertiser-be .`
6. Run `docker tag advertiser-be:latest 462404724564.dkr.ecr.eu-central-1.amazonaws.com/advertiser-be:latest`
7. Run `docker push 462404724564.dkr.ecr.eu-central-1.amazonaws.com/advertiser-be:latest`
8. Wait ~5 minutes and the new version will be deployed
9. Profit
import React from "react";
import Layout from "../../components/Layout";
import campaign from "../../ethereum/campaign";
import { CardGroup, Grid, Button } from "semantic-ui-react";
import ContributeForm from "../../components/ContributeForm";
import web3 from "../../ethereum/web3";
import Link from "next/link";

const CampaignDetail = ({
  minimumContribution,
  balance,
  requestsCount,
  approverCount,
  manager,
  address,
}) => {
  const items = [
    {
      header: manager,
      meta: "Address of Manager",
      description:
        "The manager created this campaign and can create requests to withdraw money",
      style: {
        overflowWrap: "break-word",
      },
    },
    {
      header: minimumContribution,
      meta: "Minimum Contribution (wei)",
      description:
        "You must contribute at least at much wei to become and approver",
    },
    {
      header: requestsCount,
      meta: "Number of Request",
      description:
        "A request tries to withdraw money from the contract. Requests must be approved by approvers",
    },
    {
      header: approverCount,
      meta: "Number of Approvers",
      description:
        "Number of peoples who have already donated to this campaign",
    },
    {
      header: web3.utils.fromWei(balance),
      meta: "Campaign Balance (ether)",
      description:
        "The Balance is how much money this campaign has left to spend",
    },
  ];
  return (
    <Layout>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <CardGroup items={items} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={address} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Link href={`${address}/requests`}>
        <Button style={{ marginTop: "20px" }}> View Requests</Button>
      </Link>
    </Layout>
  );
};
CampaignDetail.getInitialProps = async (props) => {
  const campaignInstance = await campaign(props.query.address)
    .methods.getSummary()
    .call();
  return {
    minimumContribution: campaignInstance[0],
    balance: campaignInstance[1],
    requestsCount: campaignInstance[2],
    approverCount: campaignInstance[3],
    manager: campaignInstance[4],
    address: props.query.address,
  };
};

export default CampaignDetail;

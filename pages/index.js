import React from "react";
import factory from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/Layout";
import Link from "next/link";
const CampaignIndex = ({ campaigns }) => {
  const renderCard = () => {
    return (
      <Card.Group>
        {campaigns.map((address) => (
          <Card fluid={true}>
            <Card.Content>
              <Card.Header>{address}</Card.Header>
              <Link href={'/campaign/'+address}>
                <Card.Description>
                  <a>View Contract</a>
                </Card.Description>
              </Link>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    );
  };
  return (
    <>
      <Layout>
        <Link href="/campaign/new">
          <Button floated="right" primary>
            Create Campaign
          </Button>
        </Link>
        {renderCard()}
      </Layout>
    </>
  );
};

CampaignIndex.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { campaigns };
};

export default CampaignIndex;

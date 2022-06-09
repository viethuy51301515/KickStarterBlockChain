import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Button, Form, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { useRouter } from "next/router";

const CampaignNew = () => {
  const [minimumContribution, setMinimumContribution] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async (event) => {
    try {
      setErrorMessage("");
      setLoading(true);
      event.preventDefault();
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minimumContribution).send({
        from: accounts[0],
      });
      setLoading(false);
      router.push("/");
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  };
  return (
    <Layout>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label={{ basic: true, content: "wei" }}
            labelPosition="right"
            onChange={(e) => {
              setMinimumContribution(e.target.value);
            }}
          />
          <Button
            primary
            type="submit"
            loading={loading}
            style={{ marginTop: "10px" }}
          >
            Create!
          </Button>
        </Form.Field>
        <Message error>{errorMessage}</Message>
      </Form>
    </Layout>
  );
};

export default CampaignNew;

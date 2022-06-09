import React from "react";
import { useState } from "react";
import {
  Form,
  FormField,
  Header as HeaderSemantic,
  Input,
  Button,
  Message,
} from "semantic-ui-react";
import Layout from "../../../../components/Layout";
import campaign from "../../../../ethereum/campaign";
import { useRouter } from "next/router";
import web3 from "../../../../ethereum/web3";
const RequestNew = () => {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    const accounts = await web3.eth.getAccounts();
    const address = router.query.address;
    try {
      await campaign(address)
        .methods.createRequest(
          description,
          web3.utils.toWei(value, "ether"),
          recipient
        )
        .send({
          from: accounts[0],
        });
      setLoading(false);
      router.push(`/campaign/${address}/requests`);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  };
  return (
    <Layout>
      <HeaderSemantic as="h1">Create a Request</HeaderSemantic>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <FormField>
          <label>Description</label>
          <Input
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </FormField>
        <FormField>
          <label>Value in Ether</label>
          <Input
            label="ether"
            labelPosition="right"
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </FormField>
        <FormField>
          <label>Recipient</label>
          <Input
            onChange={(e) => {
              setRecipient(e.target.value);
            }}
          />
        </FormField>
        <Button type="submit" primary loading={loading}>
          Create!
        </Button>
        <Message error>{errorMessage}</Message>
      </Form>
    </Layout>
  );
};

export default RequestNew;

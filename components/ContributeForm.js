import React from "react";
import { useState } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { useRouter } from "next/router";

const ContributeForm = ({ address }) => {
  const route = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const accounts = await web3.eth.getAccounts();
    setLoading(true);
    try {
      await campaign(address)
        .methods.contribute()
        .send({
          from: accounts[0],
          value: web3.utils.toWei(value, "ether"),
        });
      setLoading(false);
      route.replace(`/campaign/${address}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit} error={!!error}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          labelPosition="right"
          label="ether"
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </Form.Field>
      <Button primary type="submit" loading={loading}>
        {" "}
        Contribute
      </Button>
      <Message error>{error}</Message>
    </Form>
  );
};

export default ContributeForm;

import React from "react";
import campaign from "../../../ethereum/campaign";
import { Table, Button, Message } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import Link from "next/link";
import web3 from "../../../ethereum/web3";
import { useState } from "react";
import { useRouter } from "next/router";

const Requests = ({ address, requests, approvalCount }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [finalizeLoading, setFinalizeLoading] = useState(false);
  const approveRequest = async (index) => {
    try {
      setError("");
      setApproveLoading(true);
      const accounts = await web3.eth.getAccounts();
      await campaign(address).methods.approveRequest(index).send({
        from: accounts[0],
      });
      setApproveLoading(false);
      router.replace(`/campaign/${address}/requests`);
    } catch (error) {
      setError(error.message);
      setApproveLoading(false);
    }
  };

  const finalizeRequest = async (index) => {
    try {
      setError("");
      setFinalizeLoading(true);
      const accounts = await web3.eth.getAccounts();
      await campaign(address).methods.finalizeRequest(index).send({
        from: accounts[0],
      });
      setFinalizeLoading(false);
      router.replace(`/campaign/${address}/requests`);
    } catch (error) {
      setError(error.message);
      setFinalizeLoading(false);
    }
  };
  return (
    <Layout>
      <Link href={`/campaign/${address}/requests/new`}>
        <Button primary>Add Request</Button>
      </Link>
      <Table celled padded>
        <Table.Header>
          <Table.Row>
            <Table.Cell>ID</Table.Cell>
            <Table.Cell>Description</Table.Cell>
            <Table.Cell>Amount</Table.Cell>
            <Table.Cell>Recipient</Table.Cell>
            <Table.Cell>Approval Count</Table.Cell>
            <Table.Cell>Approve</Table.Cell>
            <Table.Cell>Finalize</Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {requests.map((item, index) => {
            return (
              <Table.Row jey={index} positive={item.complete}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{item.description}</Table.Cell>
                <Table.Cell>{item.value}</Table.Cell>
                <Table.Cell>{item.recipient}</Table.Cell>
                <Table.Cell>
                  {item.approvalCount} / {approvalCount}
                </Table.Cell>
                <Table.Cell>
                  {!item.complete && (
                    <Button
                      loading={approveLoading}
                      primary
                      onClick={() => {
                        approveRequest(index);
                      }}
                    >
                      Approve
                    </Button>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {!item.complete && (
                    <Button
                      primary
                      loading={finalizeLoading}
                      onClick={() => {
                        finalizeRequest(index);
                      }}
                    >
                      Finalize
                    </Button>
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      {!!error && <Message error={!!error} content={error} />}
    </Layout>
  );
};

Requests.getInitialProps = async (props) => {
  const address = props.query.address;
  const requestCount = await campaign(address).methods.getRequestCount().call();
  const approvalCount = await campaign(address).methods.approverCount().call();
  let requests = [];
  if (requestCount != 0) {
    requests = await Promise.all(
      Array(requestCount)
        .fill()
        .map((item, index) => {
          return campaign(address).methods.requests(index).call();
        })
    );
  }
  return {
    requests,
    address,
    approvalCount,
  };
};

export default Requests;

import { Inter } from "next/font/google";
import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  DatePicker,
  Space,
  Tag,
} from "antd";
import { title } from "process";

const inter = Inter({ subsets: ["latin"] });

function App() {
  let username;
  let title;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          backgroundColor: "#eaf7f0",
        }}
      >
        <Card style={{ width: "40%", maxWidth: "600px", height: "90%" }}>
          <h1 style={{ textAlign: "center" }}>Create New Playlist</h1>
          <Form
            onValuesChange={(change, values) => {
              username = values.Username;
              title = values.Title;
              const userData = [username, title];
              localStorage.setItem("userData", JSON.stringify(userData));
            }}
          >
            <p>Spotify UserName</p>
            <Form.Item
              name="Username"
              rules={[{ required: true, message: "Please input a username!" }]}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <p>Playlist Title</p>
            <Form.Item
              name="Title"
              rules={[{ required: true, message: "Please input your title!" }]}
            >
              <Input placeholder="Title" />
            </Form.Item>

            <Form.Item>
              <a href="http://localhost:5001/login">
                <Button
                  type="primary"
                  style={{
                    width: "100%",
                    backgroundColor: "#4CAF50",
                    marginTop: 30,
                  }}
                >
                  Create
                </Button>
              </a>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
}
export default App;

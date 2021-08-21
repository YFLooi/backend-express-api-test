const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const server = express();
const port = 3000;

server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.post(`/get-comments`, async (req, res) => {
  console.log(`Call made to /get-comments`);

  try {
    let data = await fetch(`https://jsonplaceholder.typicode.com/comments`, {
      method: "GET",
    }).then((res) => {
      return res.json();
    });

    console.log(`Sample data: ${JSON.stringify(data[0], null, 2)}`);

    data = data.map((comment) => {
      // Optional chaining prevents error on undefined values
      return {
        post_id: comment?.postId,
        post_title: comment?.name,
        post_body: comment?.body,
      };
    });

    return res
      .status("200")
      .json({ data: data, total_number_of_comments: data?.length ?? 0 });
  } catch (err) {
    console.log(`Unable to fetch from /comments API. Err: ${err}`);
    return res.status("400").json({ err: err });
  }
});

server.post(`/get-filtered-comments`, async (req, res) => {
  console.log(
    `Call made to /get-filtered-comments with filter "${req.body.filter}" and criteria "${req.body.criteria}"`
  );
  const filter = req.body?.filter;
  const criteria = req.body?.criteria;

  let data = [];
  try {
    data = await fetch(`https://jsonplaceholder.typicode.com/comments`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
      });
  } catch (err) {
    console.log(`Unable to fetch from /comments API. Err: ${err}`);
    return res.status("400").json({ err: err });
  }

  console.log(`Sample data: ${JSON.stringify(data[0], null, 2)}`);

  // Depending on the filter setting, various criteria can be ysed
  const filteredData = data.filter((comment) =>
    comment[filter].toString().toLowerCase().includes(criteria.toLowerCase())
  );

  return res.status("200").json({ data: filteredData });
});

server.post(`/get-single-post`, async (req, res) => {
  console.log(
    `Call made to /get-single-post with post_id = "${req.body?.post_id}"`
  );
  const post_id = req.body?.post_id;
  try {
    let data = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${post_id}`,
      {
        method: "GET",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
      });

    console.log(`Sample data: ${JSON.stringify(data[0], null, 2)}`);

    data = {
      post_id: data[0]?.userId,
      post_title: data[0]?.title,
      post_body: data[0]?.body,
    };

    return res
      .status("200")
      .json({ data: data, total_number_of_comments: data?.length ?? 0 });
  } catch (err) {
    console.log(`Unable to fetch from /single-post API. Err: ${err}`);
    return res.status("400").json({ err: err });
  }
});

server.post(`/get-all-posts`, async (req, res) => {
  console.log(`Call made to /get-all-posts`);
  try {
    let data = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
      method: "GET",
    }).then((res) => {
      return res.json();
    });

    console.log(`Sample data: ${JSON.stringify(data[0], null, 2)}`);

    data = data.map((post) => {
      // Optional chaining prevents error on undefined values
      return {
        post_id: post?.userId,
        post_title: post?.title,
        post_body: post?.body,
      };
    });

    return res
      .status("200")
      .json({ data: data, total_number_of_comments: data?.length ?? 0 });
  } catch (err) {
    console.log(`Unable to fetch from /all-posts API. Err: ${err}`);
    return res.status("400").json({ err: err });
  }
});

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});

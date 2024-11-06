import { Request, Response } from "express";
import { prisma } from "../db/db";
const getAll = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const contents = await prisma.post.findMany({
      where: {
        ownerId: id,
      },
    });
    res.status(200).json(contents);
    // const user = req.user;
  } catch (err) {
    throw "Internal server error";
  }
};

const createPassword = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const newEntry = await prisma.post.create({
      data: {
        title: title,
        content: content,
        ownerId: req.user.id,
      },
    });
    console.log(newEntry);
    res.json({
      message: "Password added successfully",
    });
  } catch (err) {
    throw "Internal server error";
  }
};
const modifyPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content, title } = req.body;
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
        ownerId: req.user.id,
      },
    });
    if (!post) {
      res.status(404).json({ message: "Not Found" });
      return;
    }
    await prisma.post.update({
      where: {
        id: parseInt(id),
        ownerId: req.user.id,
      },
      data: {
        content: content ? content : post?.content,
        title: title ? title : post?.title,
      },
    });
    res.status(200).json({ message: "Post updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server errror" });
  }
};

const deletePassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
        ownerId: req.user.id,
      },
    });
    if (!post) {
      res.status(404).json({ message: "Invalid request" });
      return;
    }
    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({ message: "Password Deleted Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sharePassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { uuid } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        uuid,
      },
    });
    if (!user) {
      res.status(404).json({ message: "Invalid share Id" });
      return;
    }
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
        ownerId: req.user.id,
      },
    });
    if (!post) {
      res.status(404).json({ message: "Invalid Post" });
      return;
    }
    await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        ownerId: user.id,
        sharedAt: new Date(),
      },
    });
    res.status(200).json({ message: "Password shared" });
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
};
export {
  getAll,
  createPassword,
  modifyPassword,
  deletePassword,
  sharePassword,
};

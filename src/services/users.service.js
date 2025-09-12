import prisma from "../lib/prisma.js";

export async function list() {
    return await prisma.user.findMany();
}

export async function get(id) {
    return await prisma.user.findUnique({
        where: {
            id: id,
        },
    });
}

export async function create({ name, email }) {
    return await prisma.user.create({
        data: {
            name,
            email
        }
    });
}

export async function replace(userId, { name, email }) {
    return await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            name,
            email
        },
    });
}

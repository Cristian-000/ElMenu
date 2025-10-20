// src/controllers/public.controller.js
const publicService = require('../services/public.service');

exports.handleGetPublicMenu = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const menuData = await publicService.getPublicMenuBySlug(slug);
        res.status(200).json(menuData);
    } catch (error) {
        next(error);
    }
};
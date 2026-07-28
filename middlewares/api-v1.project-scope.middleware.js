const { Op } = require('sequelize');

function getAllowedProjectUuids(req) {
    const scopes = req.apiKey?.scopes;
    if (!scopes || scopes.allProjects !== false) {
        return null;
    }
    return Array.isArray(scopes.projects) ? scopes.projects : [];
}

function canAccessProject(req, projectUuid) {
    const allowed = getAllowedProjectUuids(req);
    return allowed === null || allowed.includes(projectUuid);
}

function projectScopeWhere(req) {
    const allowed = getAllowedProjectUuids(req);
    return allowed === null ? {} : { uuid: { [Op.in]: allowed } };
}

function requireProjectScope(req, res, next) {
    if (!canAccessProject(req, req.params.projectUuid)) {
        return res.status(404).json({
            success: false,
            error: 'Not Found',
            message: 'Project not found'
        });
    }
    next();
}

module.exports = {
    getAllowedProjectUuids,
    canAccessProject,
    projectScopeWhere,
    requireProjectScope
};

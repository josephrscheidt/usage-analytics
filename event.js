module.exports = function(type, userId, clinicId, roleId, data = {}) {
        this.type = type;
        this.userId = userId;
        this.clinicId = clinicId;
        this.roleId = roleId;
        this.data = data;
    };
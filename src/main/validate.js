import is from 'is_js';

const validate = (values = {}) => {
    const errors = {
    };

    if (is.empty(values.clubName)) {
        errors.clubName = 'El club es requerido.';
    }

    const membersArrayErrors = [];
    values.members && values.members.map((member, memberIndex) => {
        let memberErrors = {};

        if (!member.name) {
            memberErrors.name = 'El nombre es requerido.';
            membersArrayErrors[memberIndex] = memberErrors;
        }

        if (!member.phone) {
            memberErrors.phone = 'El telefono es requerido.';
            membersArrayErrors[memberIndex] = memberErrors;
        }

    });

    if (membersArrayErrors.length) {
      errors.members = membersArrayErrors;
    }

    return errors;
};

export default validate;
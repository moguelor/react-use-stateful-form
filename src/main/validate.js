import is from 'is_js';

const validate = (values = {}) => {
    const errors = {
    };

    if (is.empty(values.clubName)) {
        errors.clubName = 'The club is required';
    }

    const membersArrayErrors = [];
    values.members && values.members.map((member, memberIndex) => {
        let memberErrors = {};

        if (!member.name) {
            memberErrors.name = 'The name is required';
            membersArrayErrors[memberIndex] = memberErrors;
        }

        if (!member.phone) {
            memberErrors.phone = 'The phone is required';
            membersArrayErrors[memberIndex] = memberErrors;
        }

    });

    if (membersArrayErrors.length) {
      errors.members = membersArrayErrors;
    }

    return errors;
};

export default validate;
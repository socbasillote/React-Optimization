function UserCard({ user }) {
  const fullName = `${user.firstName} ${user.lastName}`;

  return <h2>{fullName}</h2>;
}

export default UserCard;

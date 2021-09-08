import { Box, Flex, Heading, Link } from "@chakra-ui/layout";

export default function Navbar() {
  return (
    <Flex mx="4" p="4" flexDir="row" justify="space-between" align="center">
      <Heading>Utrim 🔗</Heading>
      
      <Box>
        <Link mx="4">Login</Link>
        <Link mx="4">Signup</Link>
      </Box>
    </Flex>
  );
}

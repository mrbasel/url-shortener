import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Box, Heading } from "@chakra-ui/layout";
import { Button, Input } from "@chakra-ui/react";

export default function MainForm() {
  return (
    <Box as="form" maxW="600px" mx="auto" mt="8" px="4" textAlign="center">
      <Heading mb="6">Short, readable links.</Heading>
      <FormControl id="link">
        <Input type="long-url" placeholder="Put long url here.." />
        <Button mt="4">Trim!</Button>
      </FormControl>
    </Box>
  );
}

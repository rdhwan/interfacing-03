import { Text, Heading, Stack, Image, Tag } from "@chakra-ui/react";
import TagLink from "../../../components/tag-link";

const AboutPage = () => {
  return (
    <>
      <Stack gap={"1rem"} textAlign={"justify"}>
        <Heading size={"lg"} textAlign={"left"}>
          Microcontroller-PC Communication for Temperature Control in an
          Industrial Metrology Room
        </Heading>

        <Stack direction={"column"} align={"center"}>
          <Stack direction={"row"} w={"full"} justify={"center"}>
            <Image
              src={"/person_albert.png"}
              w={["8rem", "8rem", "12rem", "12rem", "12rem"]}
              rounded={"xl"}
            />
            <Image
              src={"/person_fathan.png"}
              w={["8rem", "8rem", "12rem", "12rem", "12rem"]}
              rounded={"xl"}
            />
          </Stack>

          <Tag colorScheme="blue">Albert Tirto Kusumo (68083)</Tag>
          <Tag colorScheme="blue">Muhammad Fathan Ridhwan (69524)</Tag>
        </Stack>
        <Text>
          Welcome to our project! We've designed a system that helps monitor and
          control the temperature of an industrial metrology room. This is
          essential for maintaining a stable environment, ensuring accurate
          measurements, and overall efficiency.
        </Text>

        <Text>
          Our setup involves connecting an{" "}
          <TagLink link="https://wokwi.com/">Arduino Uno Simulator</TagLink> to
          a PC. This allows us to communicate between the devices and gather
          data from temperature sensors placed strategically in the room. The
          microcontroller acts as the master, while the PC serves as the slave,
          receiving and processing the data.
        </Text>

        <Text>
          To make this communication possible, we utilize a virtual serial port
          called{" "}
          <TagLink link="https://com0com.sourceforge.net/">com0com</TagLink>.
          This allows us to simulate the connection between the microcontroller
          and the PC within the Wokwi simulator environment. Through this
          virtual port, data is transmitted seamlessly, enabling real-time
          monitoring and control.
        </Text>

        <Text>
          Once the data is received by the PC, it's parsed and processed using a
          Node.js backend. This backend handles the storage of data at regular
          intervals using{" "}
          <TagLink link="https://github.com/serialport/node-serialport">
            serialport
          </TagLink>{" "}
          library, ensuring that valuable information is recorded and can be
          accessed when needed.
        </Text>

        <Text>
          Additionally, to regulate the temperature effectively, we've
          implemented a{" "}
          <TagLink link="https://www.arduino.cc/reference/en/libraries/pid/">
            PID controller
          </TagLink>
          . This controller adjusts the settings of the air conditioner within
          the room, maintaining the temperature within a comfortable range of 0
          to 40 degrees Celsius.
        </Text>

        <Text>
          Furthermore, we've developed a user-friendly front end using{" "}
          <TagLink link="https://vitejs.dev/">React</TagLink> that provides
          real-time monitoring of the temperature. This allows users to
          visualize the data and make informed decisions regarding the control
          of the environment.
        </Text>
      </Stack>
    </>
  );
};

export default AboutPage;

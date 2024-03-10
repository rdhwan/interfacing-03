import {
  Button,
  Heading,
  Stack,
  Text,
  IconButton,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  RepeatIcon,
  RepeatClockIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import { Link, Outlet, useLocation } from "react-router-dom";

import { motion } from "framer-motion";

const MainLayout = () => {
  const { isOpen, onToggle } = useDisclosure();

  const loc = useLocation();

  return (
    <Stack
      direction={"column"}
      minH={"100vh"}
      minW={"100vw"}
      bgColor={"#F3F8FF"}
      fontFamily={"Inter"}
      gap={0}
    >
      <Stack
        direction={"row"}
        minH={"4rem"}
        align={"center"}
        p={"1rem"}
        gap={"0.75rem"}
      >
        <IconButton
          aria-label="expand menu"
          icon={<HamburgerIcon />}
          variant={"ghost"}
          onClick={onToggle}
        />
        <Link to={"/"}>
          <Heading size={"md"}>Room Temperature Monitoring</Heading>
        </Link>
      </Stack>

      <Stack direction={"row"} flex={1} gap={0}>
        {/* sidebar */}
        <Stack
          as={motion.div}
          w={"12em"}
          minH={"full"}
          p={"1rem"}
          pl={0}
          animate={{
            width: isOpen ? "12em" : "4.5rem",
          }}
          // @ts-ignore
          transition={{
            duration: 0.5,
          }}
        >
          <Tooltip
            label={"Real-time data"}
            placement={"right"}
            isDisabled={isOpen}
            rounded={"xl"}
          >
            <Button
              as={Link}
              to={"/"}
              leftIcon={<RepeatIcon />}
              rounded={"xl"}
              roundedLeft={0}
              variant={"ghost"}
              justifyContent={"start"}
              gap={"1rem"}
              px={"1.725rem"}
              fontWeight={loc.pathname === "/" ? "bold" : "normal"}
            >
              <motion.span
                initial={{ visibility: "hidden" }}
                animate={{
                  visibility: isOpen ? "visible" : "hidden",
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{
                  duration: isOpen ? 0.5 : 0.1,
                  delay: isOpen ? 0.25 : 0,
                }}
              >
                Realtime
              </motion.span>
            </Button>
          </Tooltip>

          <Tooltip
            label={"History data"}
            placement={"right"}
            isDisabled={isOpen}
            rounded={"xl"}
          >
            <Button
              as={Link}
              to={"/history"}
              leftIcon={<RepeatClockIcon />}
              rounded={"xl"}
              roundedLeft={0}
              variant={"ghost"}
              justifyContent={"start"}
              gap={"1rem"}
              px={"1.725rem"}
              fontWeight={loc.pathname === "/history" ? "bold" : "normal"}
            >
              <motion.span
                initial={{ visibility: "hidden", opacity: 0 }}
                animate={{
                  visibility: isOpen ? "visible" : "hidden",
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{
                  duration: isOpen ? 0.5 : 0.1,
                  delay: isOpen ? 0.25 : 0,
                }}
              >
                History
              </motion.span>
            </Button>
          </Tooltip>

          <Tooltip
            label={"About this project"}
            placement={"right"}
            isDisabled={isOpen}
            rounded={"xl"}
          >
            <Button
              as={Link}
              to={"/about"}
              leftIcon={<WarningIcon />}
              rounded={"xl"}
              roundedLeft={0}
              variant={"ghost"}
              justifyContent={"start"}
              gap={"1rem"}
              px={"1.725rem"}
              fontWeight={loc.pathname === "/about" ? "bold" : "normal"}
            >
              <motion.span
                initial={{ visibility: "hidden" }}
                animate={{
                  visibility: isOpen ? "visible" : "hidden",
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{
                  duration: isOpen ? 0.5 : 0.1,
                  delay: isOpen ? 0.25 : 0,
                }}
              >
                About
              </motion.span>
            </Button>
          </Tooltip>
        </Stack>

        {/* main content */}
        <Stack
          flex={1}
          bgColor={"white"}
          roundedTopLeft={"xl"}
          p={["2rem", "2rem", "3rem", "3rem", "3rem"]}
        >
          <Outlet />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MainLayout;

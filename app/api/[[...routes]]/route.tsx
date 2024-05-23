/** @jsxImportSource frog/jsx */

import { Box, Heading, Text, VStack, vars } from "@/app/ui";
import { Button, Frog, TextInput, parseEther } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import ConstantFlowAgreementV1ABI from "@/app/abis/ConstantFlowAgreementV1ABI";
import configuration, { Address } from "@/app/configuration";
import {
  AirStackUser,
  fetchPlayers,
  fetchPlayersByFID,
} from "@/app/utils/AirStackUtils";
import { init } from "@airstack/node";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { FC } from "react";
import { buildShareUrl } from "@/app/utils/WarpcastUtils";
import { getBaseUrl } from "@/app/utils/URLUtils";
import YoWFactoryABI from "@/app/abis/YoWFactoryABI";
import { createPublicClient, http } from "viem";
import { degen } from "viem/chains";

interface IntroProps {
  title: string;
  description: JSX.Element | string;
  player1?: string;
  player2?: string;
}

const GAME_INFO = [
  "Challenge your friend to a $YOINK battle",
  "Invite friends to your team",
  "Stream as many $YOINK as possible to win the battle",
  "The team with the most $YOINK wins",
  "The winners will get all of the $YOINK tokens spent in the game",
];

const YOW_FACTORY_CONTRACT_ADDRESS =
  "0x4812B2F0C04e097fdBc29b5f6BDd2d437bc03d36";

const Intro: FC<IntroProps> = ({ title, description, player1, player2 }) => {
  return (
    <Box
      grow
      alignHorizontal="center"
      backgroundColor="background"
      backgroundImage={`url("${getBaseUrl()}/intro.png")`}
      backgroundSize="contain"
      padding="32"
      fontWeight="700"
      textAlign="center"
      paddingTop="60"
    >
      <div style={{ display: "flex" }}>
        <VStack gap="12">
          <Text size={{ custom: "90px" }} color="red" align="center">
            {title}
          </Text>
          {typeof description === "string" ? (
            <Text size={{ custom: "60px" }} align="center">
              {description}
            </Text>
          ) : (
            description
          )}
        </VStack>

        {player1 && (
          <div
            style={{
              position: "absolute",
              top: "315px",
              left: "50px",
              color: vars.colors.red,
              fontSize: "40px",
            }}
          >
            {player1}
          </div>
        )}
        {player1 && (
          <img
            src={`${getBaseUrl()}/arrow-left.svg`}
            style={{
              position: "absolute",
              height: "72px",
              top: "350px",
              left: "0px",
            }}
          />
        )}

        {player2 && (
          <div
            style={{
              position: "absolute",
              top: "440px",
              right: "120px",
              color: vars.colors.red,
              fontSize: "40px",
            }}
          >
            {player2}
          </div>
        )}

        {player2 && (
          <img
            src={`${getBaseUrl()}/arrow-right.svg`}
            style={{
              position: "absolute",
              height: "72px",
              top: "480px",
              right: "60px",
            }}
          />
        )}
      </div>
    </Box>
  );
};

const Info: FC<{ gameInfo: string[] }> = ({ gameInfo }) => {
  return (
    <div
      style={{
        border: "8px solid black",
        background: "white",
        borderRadius: "16px",
        padding: "34px 40px",
        textAlign: "left",
        width: "750px",
        display: "flex",
        flexDirection: "column",
        gap: "26px",
      }}
    >
      {gameInfo.map((info, idx) => {
        return (
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "0 0 6%",
              }}
            >
              <Text size={{ custom: "42px" }}>{idx + 1}. </Text>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "0 0 94%",
              }}
            >
              <Text size={{ custom: "42px" }}>{info}</Text>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Battle = () => {
  return (
    <Box
      grow
      alignHorizontal="center"
      backgroundColor="background"
      backgroundImage={`url("${getBaseUrl()}/battle.png")`}
      backgroundSize="contain"
      padding="32"
      fontWeight="700"
    >
      <VStack gap="4">
        <Text size={{ custom: "50px" }} align="center">
          CURRENTLY WINNING
        </Text>
        <Text size={{ custom: "90px" }} color="red" align="center">
          Your team
        </Text>

        <div
          style={{
            display: "flex",
            marginTop: "100px",
            justifyContent: "space-between",
            width: "660px",
            alignSelf: "center",
          }}
        >
          <Text size={{ custom: "50px" }} color="red">
            2 mates
          </Text>
          <Text size={{ custom: "50px" }} color="red">
            3 mates
          </Text>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "300px",
            justifyContent: "space-between",
            width: "800px",
            textAlign: "center",
            alignSelf: "center",
          }}
        >
          <div
            style={{
              border: "6px solid black",
              background: "white",
              borderRadius: "18px",
              display: "flex",
              flexDirection: "column",
              minWidth: "320px",
            }}
          >
            <Text size={{ custom: "50px" }} align="center">
              123
            </Text>
            <Text size={{ custom: "50px" }} align="center">
              $YOINK
            </Text>
          </div>
          <div
            style={{
              border: "6px solid black",
              background: "white",
              borderRadius: "18px",
              display: "flex",
              flexDirection: "column",
              minWidth: "320px",
            }}
          >
            <Text size={{ custom: "50px" }} align="center">
              123
            </Text>
            <Text size={{ custom: "50px" }} align="center">
              $YOINK
            </Text>
          </div>
        </div>
      </VStack>
    </Box>
  );
};

interface ErrorProps {
  title: string;
  content: string;
}

const Error: FC<ErrorProps> = ({ title, content }) => {
  return (
    <Box
      grow
      alignHorizontal="center"
      backgroundColor="background"
      padding="32"
    >
      <VStack gap="4">
        <Heading>{title}</Heading>
        <Text size={{ custom: "50px" }}>{content}</Text>
      </VStack>
    </Box>
  );
};

interface StreamProps {
  flowRate: number;
  title: string;
}

const Stream: FC<StreamProps> = ({ flowRate, title }) => {
  return (
    <Box
      grow
      alignHorizontal="center"
      backgroundColor="background"
      backgroundImage={`url("${getBaseUrl()}/yoink.png")`}
      backgroundSize="cover"
      padding="48"
      fontWeight="700"
      textAlign="center"
    >
      <VStack gap="16" alignHorizontal="center">
        <Text size={{ custom: "50px" }}>{title}</Text>

        <div style={{ display: "flex", width: "624px" }}>
          <Text size={{ custom: "60px" }} color="red">
            Stream as many $YOINK as possible to win the war
          </Text>
        </div>
        <div
          style={{
            border: "8px solid black",
            background: "white",
            borderRadius: "16px",
            paddingBottom: "34px",
            textAlign: "center",
            width: "750px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "70px",
          }}
        >
          <Text size={{ custom: "200px" }}>{flowRate}</Text>
          <Text size={{ custom: "40px" }} color="red">
            YOINK / hour
          </Text>
        </div>
      </VStack>
    </Box>
  );
};

init(process.env.AIRSTACK_API_KEY!);

type State = {
  team?: string;
  flowRate: number;
  teams: [AirStackUser, AirStackUser] | [];
};

const app = new Frog<{ State: State }>({
  assetsPath: "/",
  basePath: "/api",
  imageAspectRatio: "1:1",
  imageOptions: { width: 955, height: 955 },
  ui: { vars },

  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
  initialState: {
    flowRate: 1,
    team: undefined,
    teams: [],
  },
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", async (c) => {
  const { inputText, frameData, buttonValue, deriveState } = c;

  console.log({ frameData });

  const challengerHandle = inputText;

  const state = await deriveState(async (previousState) => {
    switch (buttonValue) {
      case "reset":
        previousState.teams = [];
        previousState.flowRate = 1;
        break;
      case "inc":
        previousState.flowRate++;
        break;
      case "dec":
        previousState.flowRate = Math.max(1, previousState.flowRate - 1);
        break;
    }

    if (challengerHandle && previousState.teams.length !== 2) {
      const teamsData = await fetchPlayers(
        frameData?.fid?.toString(),
        challengerHandle
      );

      if (!teamsData.includes(undefined)) {
        previousState.teams = teamsData as [AirStackUser, AirStackUser];
      }
    }
  });

  if (state.teams.length !== 2) {
    return c.res({
      image: (
        <Intro
          title="YOINK OF WAR"
          description={
            <Text size={{ custom: "60px" }} align="center">
              <div style={{ display: "flex" }}>
                Challenge your{" "}
                <span style={{ color: vars.colors.red, marginLeft: "12px" }}>
                  friend
                </span>
                , gather an
              </div>
              <div>army and win $YOINK</div>
            </Text>
          }
        />
      ),
      intents: [
        <TextInput placeholder="Enter challenger handle..." />,
        <Button>Challenge!</Button>,
        <Button action="/info">Game Info!</Button>,
      ],
    });
  }

  const [myData, opponentData] = state.teams;

  if (!myData || !opponentData) {
    return c.res({
      image: (
        <Error
          title="Could not find the opponent."
          content="Please go back and try to enter a correct handle."
        />
      ),
      intents: [<Button.Reset>Back</Button.Reset>],
    });
  }

  return c.res({
    image: (
      <Stream
        flowRate={state.flowRate}
        title={`CHALLENGING @${opponentData.profileHandle}`.toUpperCase()}
      />
    ),
    intents: [
      <Button value="inc">+</Button>,
      <Button value="dec">-</Button>,
      <Button.Transaction
        action={`/share/${myData.userId}:${opponentData.userId}`}
        target={`/create-battle/${myData.userId}:${opponentData.userId}`}
      >
        Start Stream
      </Button.Transaction>,
      <Button value="reset">Back</Button>,
    ],
  });
});

app.frame("/share/:battleid", async (c) => {
  const { buttonValue, status, deriveState, frameData, env, req, verified } = c;

  const { battleid } = req.param();
  const [player1, player2] = battleid.split(":");

  const state = deriveState((previousState) => {});

  if (state.teams.length !== 2) {
    const teamsData = await fetchPlayersByFID(player1, player2);

    if (!teamsData.includes(undefined)) {
      state.teams = teamsData as [AirStackUser, AirStackUser];
    }
  }

  const myData = state.teams[0];
  const opponentData = state.teams[1];

  return c.res({
    image: (
      <Box
        grow
        alignHorizontal="center"
        backgroundColor="background"
        backgroundImage={`url("${getBaseUrl()}/yoink.png")`}
        backgroundSize="cover"
        padding="48"
        fontWeight="700"
        textAlign="center"
      >
        <VStack gap="16" alignHorizontal="center">
          <Text size={{ custom: "50px" }}>YOU'VE BEEN CHALLENGED</Text>
          <Text size={{ custom: "60px" }} color="red">
            @{myData!.profileHandle} challenged you to a
          </Text>
          <Text size={{ custom: "60px" }} color="red">
            $YOINK battle!
          </Text>
          <div
            style={{
              border: "8px solid black",
              background: "white",
              borderRadius: "16px",
              padding: "34px",
              textAlign: "center",
              width: "750px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "60px",
            }}
          >
            <Text size={{ custom: "60px" }}>
              Accept the challenge by yoinking more than him. Invite your mates
              to yoink on your side and win together.
            </Text>
            <div style={{ display: "flex", marginTop: "20px" }}>
              <Text size={{ custom: "40px" }} color="red">
                @{myData!.profileHandle} yoinked 12345 times
              </Text>
            </div>
          </div>
        </VStack>
      </Box>
    ),
    intents: [
      <Button action={`/battle/${battleid}`}>Go to battle</Button>,
      <Button.Link
        href={buildShareUrl(
          opponentData!.profileHandle,
          `${myData!.userId}:${opponentData!.userId}`
        )}
      >
        Cast battle!
      </Button.Link>,
      <Button action="/">Back!</Button>,
    ],
  });
});

// TODO:
app.frame("/stats/:battleId", (c) => {
  const { battleId } = c.req.param();

  return c.res({
    image: (
      <Box
        grow
        alignHorizontal="center"
        backgroundColor="background"
        backgroundImage={`url("${getBaseUrl()}/yoink.png")`}
        backgroundSize="cover"
        padding="48"
        fontWeight="700"
        textAlign="center"
      >
        <VStack gap="16" alignHorizontal="center">
          <Text size={{ custom: "50px" }}>STATISTICS</Text>
          <div
            style={{
              border: "8px solid black",
              background: "white",
              borderRadius: "16px",
              padding: "34px 40px",
              textAlign: "left",
              width: "750px",
              display: "flex",
              flexDirection: "column",
              gap: "26px",
            }}
          >
            {/* TODO: refactor */}
            {/* Total Yoinkers */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text size={{ custom: "42px" }}># Total Yoinkers</Text>
              <Text size={{ custom: "42px" }} color="red">
                123
              </Text>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text size={{ custom: "42px" }}># @Username Team</Text>
              <Text size={{ custom: "42px" }} color="red">
                123
              </Text>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text size={{ custom: "42px" }}># @Username Team</Text>
              <Text size={{ custom: "42px" }} color="red">
                123
              </Text>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text size={{ custom: "42px" }}>Yoink rates</Text>
              <Text size={{ custom: "42px" }} color="red">
                123
              </Text>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text size={{ custom: "42px" }}>Game ending in</Text>
              <Text size={{ custom: "42px" }} color="red">
                12h 34m 5s
              </Text>
            </div>
          </div>
        </VStack>
      </Box>
    ),
    intents: [<Button action={`/battle/${battleId}`}>Close Stats</Button>],
  });
});

app.frame("/info", (c) => {
  return c.res({
    image: (
      <Box
        grow
        alignHorizontal="center"
        backgroundColor="background"
        backgroundImage={`url("${getBaseUrl()}/yoink.png")`}
        backgroundSize="cover"
        padding="48"
        fontWeight="700"
        textAlign="center"
      >
        <VStack gap="16" alignHorizontal="center">
          <Text size={{ custom: "50px" }}>GAME INFO</Text>
          <Info gameInfo={GAME_INFO} />
        </VStack>
      </Box>
    ),
    intents: [<Button.Reset>Close Info</Button.Reset>],
  });
});

app.frame("/battle/:battleId", async (c) => {
  // TODO: Check if already in game OR just chose the team. If so, show game state.
  const { buttonValue, status, deriveState, frameData, env, req, verified } = c;

  console.log({ status, verified, env, frameData });

  const { battleId } = req.param();
  const [player1, player2] = battleId.split(":");

  console.log({ player1, player2 });

  // Fetch the battle data
  const publicClient = createPublicClient({
    chain: degen,
    transport: http(),
  });

  const yowAddress = await publicClient.readContract({
    address: YOW_FACTORY_CONTRACT_ADDRESS,
    abi: YoWFactoryABI,
    functionName: "getBattle",
    args: [battleId],
  });

  // TODO: Fetch your current stream and team for this battle.
  const inGame = false;

  // TODO: Check if both people have started streams.
  const hasStarted = true;

  const state = await deriveState(async (previousState) => {
    switch (buttonValue) {
      case "team1":
        previousState.team = player1;
        previousState.flowRate = 1;
        break;
      case "team2":
        previousState.team = player2;
        previousState.flowRate = 1;
        break;
      case "reset":
        previousState.team = undefined;
        break;
      case "inc":
        previousState.flowRate++;
        break;
      case "dec":
        previousState.flowRate = Math.max(1, previousState.flowRate - 1);
        break;
    }

    if (previousState.teams.length !== 2) {
      const teamsData = await fetchPlayersByFID(player1, player2);
      if (!teamsData.includes(undefined)) {
        previousState.teams = teamsData as [AirStackUser, AirStackUser];
      }
    }
  });

  if (state.teams.length !== 2) {
    return c.res({
      image: (
        <Error title="Could not find the teams." content="Please try again." />
      ),
      intents: [<Button>Battle!</Button>],
    });
  }

  if (!hasStarted) {
    return c.res({
      image: (
        <Error
          title="Challenge not accepted yet."
          content="Anyone can join when both players have started a stream."
        />
      ),
    });
  }

  // TODO: If user that was challenged, automatically let them choose a flow rate.

  if (inGame || state.team) {
    const teamData = state.teams.find((team) => team.userId === state.team);

    if (!teamData) {
      return c.res({
        image: <Error title="Match not found." content="Please try again." />,
        intents: [<Button.Reset>Back</Button.Reset>],
      });
    }

    return c.res({
      image: <Stream title="HELP YOUR FREN" flowRate={state.flowRate} />,
      intents: [
        <Button value="inc">+</Button>,
        <Button value="dec">-</Button>,
        <Button action="/end">Start stream</Button>,
        <Button value="reset">Back</Button>,
      ],
    });
  }

  return c.res({
    image: <Battle />,
    intents: [
      <Button value="team1">Join @{state.teams[0].profileHandle}</Button>,
      <Button action={`/stats/${battleId}`}>Game Stats</Button>,
      <Button value="team2">Join @{state.teams[1].profileHandle}</Button>,
    ],
  });
});

app.frame("/end", (c) => {
  return c.res({
    image: (
      <Intro
        title="YOUR TEAM GOT REKT"
        description="Enemy team will claim all of your YOINK tokens spent in the game."
        player2="IT'S YOU"
      />
    ),
    intents: [
      <Button action="/" value="reset">
        New Game
      </Button>,
    ],
  });
});

// Create a new battle
app.transaction("/create-battle/:battleId", async (c) => {
  const { battleId } = c.req.param();
  const { frameData, previousState } = c;

  const [player1, player2] = previousState.teams;

  console.log(player1, player2);

  return c.contract({
    abi: YoWFactoryABI,
    functionName: "createYoW",
    args: [
      player1?.connectedAddresses[0].address,
      player2?.connectedAddresses[0].address,
      battleId,
    ],
    chainId: "eip155:666666666" as any,
    to: YOW_FACTORY_CONTRACT_ADDRESS,
    value: parseEther("0"),
  });
});

app.transaction("/start/:address/:flowRate", async (c) => {
  const { address, flowRate } = c.req.param();

  return c.contract({
    abi: ConstantFlowAgreementV1ABI,
    functionName: "createFlow",
    to: configuration.contracts.ConstantFlowAgreementV1,
    chainId: "eip155:8453",
    args: [
      configuration.contracts.Token,
      address as Address,
      BigInt(flowRate),
      "0x",
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

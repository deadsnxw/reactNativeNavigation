import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

function StopwatchScreen() {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        let interval;
        if (running) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (!running) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [running]);

    const formatTime = (time) => {
        const getSeconds = `0${(time % 60)}`.slice(-2);
        const minutes = Math.floor(time / 60);
        const getMinutes = `0${minutes % 60}`.slice(-2);
        const getHours = `0${Math.floor(time / 3600)}`.slice(-2);
        return `${getHours}:${getMinutes}:${getSeconds}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.time}>{formatTime(time)}</Text>
            <Button title={running ? "Stop" : "Start"} onPress={() => setRunning(!running)} />
        </View>
    );
}

function TimerScreen() {
    const [hours, setHours] = useState('0');
    const [minutes, setMinutes] = useState('0');
    const [seconds, setSeconds] = useState('0');
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        let interval;
        if (running && time > 0) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (time === 0 && running) {
            setRunning(false);
            setFinished(true);
        }
        return () => clearInterval(interval);
    }, [running, time]);

    const startTimer = () => {
        const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
        setTime(totalSeconds);
        setRunning(true);
        setFinished(false);
    };

    const formatTime = (time) => {
        const getSeconds = `0${(time % 60)}`.slice(-2);
        const minutes = Math.floor(time / 60);
        const getMinutes = `0${minutes % 60}`.slice(-2);
        const getHours = `0${Math.floor(time / 3600)}`.slice(-2);
        return `${getHours}:${getMinutes}:${getSeconds}`;
    };

    return (
        <View style={[styles.container, finished && styles.finished]}>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={hours}
                onChangeText={setHours}
                placeholder="Hours"
            />
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={minutes}
                onChangeText={setMinutes}
                placeholder="Minutes"
            />
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={seconds}
                onChangeText={setSeconds}
                placeholder="Seconds"
            />
            <Button title="Start Timer" onPress={startTimer} />
            <Text style={styles.time}>{formatTime(time)}</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        if (route.name === 'Stopwatch') {
                            iconName = 'timer-outline';
                        } else if (route.name === 'Timer') {
                            iconName = 'time-outline';
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
            >
                <Tab.Screen name="Stopwatch" component={StopwatchScreen} />
                <Tab.Screen name="Timer" component={TimerScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    time: {
        fontSize: 48,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        width: '80%',
        textAlign: 'center',
    },
    finished: {
        backgroundColor: 'red',
    },
});
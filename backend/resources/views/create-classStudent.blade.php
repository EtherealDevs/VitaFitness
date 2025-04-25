<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Record Attendance</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }

        form {
            width: 300px;
            margin: 50px auto;
        }

        label,
        select,
        input {
            display: block;
            width: 100%;
            margin-bottom: 5px;
        }

        .success {
            color: green;
            margin-bottom: 10px;
        }
    </style>
</head>

<body>
    <h2>Record Attendance</h2>

    @if (session('success'))
        <p class="success">{{ session('success') }}</p>
    @endif

    <form action="{{ route('testing.class.students.store') }}" method="POST">
        @csrf
        <input type="hidden" name="class_schedule_id" value="{{ $classSchedule->id }}">
        <input type="hidden" name="c_sch_ts_id" value="{{ $timeslot->id }}">
        <!-- resources/views/students-form.blade.php -->
        <div id="selectContainer">
            <!-- Initial select -->
            <div id="select-wrapper-1">
                <select name="students[]" required>
                    <option value="">-- Choose a student --</option>
                    @foreach($students as $student)
                        <option value="{{ $student->id }}">{{ $student->name }} {{$student->last_name}}</option>
                    @endforeach
                </select>
                <button type="button" onclick="removeSelect('select-wrapper-1')">Remove</button>
            </div>
        </div>
        <br>
        <button type="button" onclick="addSelect()">Add Student</button>
        <br><br>



        <button type="submit">Submit</button>
    </form>
    @json($students)
    <script>
        let selectCount = 1;
        const students = @json($students); // Pass PHP array into JS
        console.log(students);

        function addSelect() {
            selectCount++;
            const id = `select-wrapper-${selectCount}`;
            const container = document.getElementById('selectContainer');

            const div = document.createElement('div');
            div.id = id;

            const select = document.createElement('select');
            select.name = 'students[]';
            select.required = true;

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = '-- Choose a student --';
            select.appendChild(defaultOption);

            students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id;
                option.text = student.name + ' ' + student.last_name;
                select.appendChild(option);
            });

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.innerText = 'Remove';
            removeButton.onclick = () => removeSelect(id);

            div.appendChild(select);
            div.appendChild(removeButton);
            container.appendChild(div);
        }

        function removeSelect(id) {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
        }
    </script>
</body>

</html>
